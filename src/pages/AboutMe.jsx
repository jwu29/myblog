import Navbar from "../components/Navbar";
import profilePic from "../assets/profile-photo.jpg";
import blogBanner from "../assets/blog-banner-2.jpg";
import AboutMeArticles from "../components/AboutMeHome";
import ArticlesInfo from "../data/ArticlesInfo.json";

export default function AboutMeMain() {
  const NumArticles = ArticlesInfo.articles.length;
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
        <img
          src={blogBanner}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-blue-600/40"></div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-1/5 flex items-center justify-center">
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md top-1/2 left-1/2"
          />
        </div>
        <div className="w-4/5 relative">
          <h1 className="text-3xl font-bold">Josiah Wu</h1>
          <p className="text-gray-400">Student | IT enthusiast</p>
          <p className="text-gray-400 max-w-4xl">
            - IT Administrator @ GLETCC, Australia
          </p>
          <p className="text-gray-400 max-w-4xl">
            - Masters of IT, Cybersecurity Major @ University of Technology
            Sydney, Australia
          </p>
          <p className="text-gray-400 max-w-4xl">
            - Bachelors of Mathematics with Statistics @ Imperial College
            London, UK
          </p>
          <p className="text-gray-400 max-w-4xl">
            - Special interests in DevOps, Cloud Security, System Administration
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a
              href="https://www.linkedin.com/in/josiah-wu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/jwu29"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
