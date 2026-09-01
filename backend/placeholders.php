<?php
/**
 * Canonical list of every ad slot ("placeholder") that actually exists on the
 * site — one entry per <AdSlot slot="..."> in the Next.js frontend. This is
 * the single source of truth for:
 *   - the Placeholder dropdown in admin/ads.php
 *   - the format each placeholder renders at (leaderboard/rectangle/banner),
 *     so an admin never has to pick a mismatched size for a slot
 *   - validating that an ad's placeholder is a real, existing slot
 *
 * If a new ad slot is ever added to the frontend (a new <AdSlot slot="x" />),
 * add a matching entry here or it won't be selectable in the admin panel.
 */

const AD_PLACEHOLDERS = [
    'home-top' => ['group' => 'Homepage', 'label' => 'Top', 'format' => 'leaderboard'],
    'home-mid' => ['group' => 'Homepage', 'label' => 'Middle', 'format' => 'banner'],
    'home-bottom' => ['group' => 'Homepage', 'label' => 'Bottom', 'format' => 'leaderboard'],

    'stories-top' => ['group' => 'Stories List', 'label' => 'Top', 'format' => 'leaderboard'],
    'stories-mid' => ['group' => 'Stories List', 'label' => 'Middle', 'format' => 'rectangle'],
    'stories-bottom' => ['group' => 'Stories List', 'label' => 'Bottom', 'format' => 'banner'],

    'story-top' => ['group' => 'Story Detail', 'label' => 'Top', 'format' => 'leaderboard'],
    'story-mid' => ['group' => 'Story Detail', 'label' => 'Middle', 'format' => 'rectangle'],
    'story-bottom' => ['group' => 'Story Detail', 'label' => 'Bottom', 'format' => 'banner'],

    'category-top' => ['group' => 'Category Pages', 'label' => 'Top', 'format' => 'leaderboard'],
    'category-mid' => ['group' => 'Category Pages', 'label' => 'Middle', 'format' => 'rectangle'],
    'category-bottom' => ['group' => 'Category Pages', 'label' => 'Bottom', 'format' => 'banner'],

    'submit-top' => ['group' => 'Share Your Experience', 'label' => 'Top', 'format' => 'leaderboard'],
    'submit-mid' => ['group' => 'Share Your Experience', 'label' => 'Middle', 'format' => 'rectangle'],
    'submit-bottom' => ['group' => 'Share Your Experience', 'label' => 'Bottom', 'format' => 'banner'],

    'survey-top' => ['group' => 'Survey', 'label' => 'Top', 'format' => 'leaderboard'],
    'survey-mid' => ['group' => 'Survey', 'label' => 'Middle', 'format' => 'rectangle'],
    'survey-bottom' => ['group' => 'Survey', 'label' => 'Bottom', 'format' => 'banner'],

    'write-top' => ['group' => 'Write For Us', 'label' => 'Top', 'format' => 'leaderboard'],
    'write-mid' => ['group' => 'Write For Us', 'label' => 'Middle', 'format' => 'rectangle'],
    'write-bottom' => ['group' => 'Write For Us', 'label' => 'Bottom', 'format' => 'banner'],

    'about-top' => ['group' => 'About Page', 'label' => 'Top', 'format' => 'leaderboard'],
    'about-mid' => ['group' => 'About Page', 'label' => 'Middle', 'format' => 'rectangle'],
    'about-bottom' => ['group' => 'About Page', 'label' => 'Bottom', 'format' => 'banner'],

    'resources-top' => ['group' => 'Resources Page', 'label' => 'Top', 'format' => 'leaderboard'],
    'resources-mid' => ['group' => 'Resources Page', 'label' => 'Middle', 'format' => 'rectangle'],
    'resources-bottom' => ['group' => 'Resources Page', 'label' => 'Bottom', 'format' => 'banner'],

    'insights-top' => ['group' => 'Insights Page', 'label' => 'Top', 'format' => 'leaderboard'],
    'insights-mid' => ['group' => 'Insights Page', 'label' => 'Middle', 'format' => 'rectangle'],
    'insights-bottom' => ['group' => 'Insights Page', 'label' => 'Bottom', 'format' => 'banner'],
];

function placeholder_format(string $key): ?string {
    return AD_PLACEHOLDERS[$key]['format'] ?? null;
}
