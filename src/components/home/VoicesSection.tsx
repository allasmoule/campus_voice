export default function VoicesSection() {
  const voices = [
    {
      quote: "I felt respected for the first time in my academic career when a professor actually listened to my perspective as a first-gen student.",
      role: "Undergraduate Student",
      area: "Social Sciences",
      color: "#6366F1",
    },
    {
      quote: "The pressure to perform while being constantly scrutinized made me question if I belonged in academia at all.",
      role: "Graduate Student",
      area: "STEM",
      color: "#DC2626",
    },
    {
      quote: "My department created a mentorship program that changed everything. I finally felt like someone had my back.",
      role: "Faculty",
      area: "Humanities",
      color: "#059669",
    },
    {
      quote: "Nobody talks about how isolating it is to be the only person who looks like you in your entire program.",
      role: "Graduate Student",
      area: "Professional Programs",
      color: "#D97706",
    },
  ];

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Voices from Campus
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Anonymous experiences shared by real people in higher education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {voices.map((v, i) => (
            <div
              key={i}
              className="relative bg-gray-50 rounded-xl p-6 border-l-4"
              style={{ borderLeftColor: v.color }}
            >
              <svg className="absolute top-4 right-4 w-8 h-8 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
              </svg>
              <p className="text-gray-700 text-sm leading-relaxed italic pr-8">
                &ldquo;{v.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: v.color }}
                />
                <span className="text-xs text-gray-500 font-medium">
                  {v.role} · {v.area}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
