import React from "react";
import { motion } from "framer-motion";

const topics = [
  {
    title: "Addition",
    videos: [
      {
        title: "Fun Addition for Kids!",
        url: "https://www.youtube.com/embed/WT_wvvEvkw4"
      },
      {
        title: "Learn to Add with Cartoons!",
        url: "https://www.youtube.com/embed/D0Ajq682yrA"
      }
    ]
  },
  {
    title: "Subtraction",
    videos: [
      {
        title: "Subtraction Magic for Kids!",
        url: "https://www.youtube.com/embed/QkPa9V2wtZs"
      },
      {
        title: "Easy Subtraction with Animation!",
        url: "https://www.youtube.com/embed/UoV0vQkP0Y4"
      }
    ]
  },
  {
    title: "Multiplication",
    videos: [
      {
        title: "Multiplication Song Table 2-5",
        url: "https://www.youtube.com/embed/eP0v2YYFwJ4"
      },
      {
        title: "Fun with Times Tables",
        url: "https://www.youtube.com/embed/BHq6xgMU6t4"
      }
    ]
  },
  {
    title: "Division",
    videos: [
      {
        title: "Division Made Easy for Kids",
        url: "https://www.youtube.com/embed/3AOoQRtWcJ0"
      },
      {
        title: "Cartoon Math: Division!",
        url: "https://www.youtube.com/embed/CqOfi41LfDw"
      }
    ]
  }
];

const Lessons = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-400 to-blue-600 p-6">
      <h1 className="text-4xl font-bold text-center text-pink-600 mb-8 animate-bounce">
        📚 Learn Math the Fun Way!
      </h1>
      <div className="space-y-12">
        {topics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="p-6 rounded-2xl  "
          >
            <h2 className="text-3xl font-semibold text-white mb-4">🔢 {topic.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {topic.videos.map((video, vidIndex) => (
                <div
                  key={vidIndex}
                  className=" rounded-xl p-3  transition duration-300"
                >
                  <h3 className="text-xl font-bold text-pink-500 mb-2">🎥 {video.title}</h3>
                  <div className="aspect-video rounded overflow-hidden">
                    <iframe
                      src={video.url}
                      title={video.title}
                      allowFullScreen
                      className="w-full h-full rounded-lg border-2 border-pink-200"
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
