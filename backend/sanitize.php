<?php
/**
 * Strict allowlist HTML sanitizer for rich-text submissions (no external
 * dependency like HTML Purifier needed — this covers exactly the tags the
 * rich text editor can produce, nothing else).
 *
 * Only these tags survive; everything else is unwrapped (its children are
 * kept, the tag itself is dropped) rather than deleted outright, so text
 * inside an unknown tag isn't lost. Every attribute is stripped except the
 * few explicitly allowed below, so there is no way to smuggle in an
 * onerror=, a javascript: URL, or arbitrary CSS.
 */

const SANITIZE_ALLOWED_TAGS = [
    'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre', 'hr', 'a', 'img', 'span', 'h2', 'h3', 'h4',
];

function sanitize_rich_html(string $html): string {
    if (trim($html) === '') return '';

    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    $dom->loadHTML(
        '<?xml encoding="utf-8"?><div>' . $html . '</div>',
        LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NOXMLDECL
    );
    libxml_clear_errors();

    $wrapper = $dom->getElementsByTagName('div')->item(0);
    if (!$wrapper) return '';

    sanitize_dom_node($wrapper);

    $out = '';
    foreach (iterator_to_array($wrapper->childNodes) as $child) {
        $out .= $dom->saveHTML($child);
    }
    return $out;
}

function sanitize_dom_node(DOMNode $node): void {
    foreach (iterator_to_array($node->childNodes) as $child) {
        if ($child->nodeType === XML_ELEMENT_NODE) {
            /** @var DOMElement $child */
            $tag = strtolower($child->nodeName);

            if (!in_array($tag, SANITIZE_ALLOWED_TAGS, true)) {
                // Unwrap: hoist children up in place of the disallowed tag, then drop it.
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }

            sanitize_dom_attributes($child, $tag);
            sanitize_dom_node($child);
        } elseif ($child->nodeType !== XML_TEXT_NODE) {
            // Comments, processing instructions, etc.
            $node->removeChild($child);
        }
    }
}

function sanitize_dom_attributes(DOMElement $el, string $tag): void {
    $keep = [];

    if ($tag === 'a') {
        $href = $el->getAttribute('href');
        if (preg_match('#^(https?://|mailto:)#i', $href)) {
            $keep['href'] = $href;
            $keep['target'] = '_blank';
            $keep['rel'] = 'noopener noreferrer nofollow ugc';
        }
    } elseif ($tag === 'img') {
        $src = $el->getAttribute('src');
        if (preg_match('#^(https?://|/uploads/)#i', $src)) {
            $keep['src'] = $src;
        }
        $alt = $el->getAttribute('alt');
        if ($alt !== '') {
            $keep['alt'] = mb_substr($alt, 0, 200);
        }
    } elseif ($tag === 'span') {
        $style = trim($el->getAttribute('style'));
        if (preg_match('/^color:\s*#[0-9a-fA-F]{3,8};?$/', $style)) {
            $keep['style'] = rtrim($style, ';') . ';';
        }
    }

    foreach (iterator_to_array($el->attributes) as $attr) {
        $el->removeAttribute($attr->name);
    }
    foreach ($keep as $name => $val) {
        $el->setAttribute($name, $val);
    }

    // An <img> that lost its src (invalid/disallowed source) is useless — drop it.
    if ($tag === 'img' && !$el->hasAttribute('src') && $el->parentNode) {
        $el->parentNode->removeChild($el);
    }
}
