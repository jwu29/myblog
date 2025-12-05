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
          <p className="text-gray-400">Student • {NumArticles} articles</p>
          <p className="text-gray-400 max-w-4xl">
            - Masters of IT, Cybersecurity Major @ University of Technology
            Sydney, Australia (In Progress)
          </p>
          <p className="text-gray-400 max-w-4xl">
            - Completed Bachelors of Mathematics with Statistics @ Imperial
            College London, UK
          </p>
          <p className="text-gray-400 max-w-4xl">
            - Interested in Data Engineering, DevOps, Cloud Security
          </p>
          <button
            className="mt-2 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
            onClick={() => navigate("/contact")}
          >
            Contact Me
          </button>
        </div>
      </div>

      <div className="border-b border-zinc-800 mb-4">
        <div className="flex gap-6">
          <button className="pb-3 border-b-2 border-white font-semibold">
            Articles
          </button>
        </div>
      </div>

      <div className="mt-10 px-4">
        <AboutMeArticles />
      </div>
    </div>
  );
}
