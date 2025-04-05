"use client";
import React, { useState, useEffect } from "react";
import ImageGrid from "../components/ImageGrid";

function MainComponent() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetch-art-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, limit: 12 }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setImages((prev) => [...(prev || []), ...(data?.images || [])]);
      setHasMore(page < (data?.pagination?.totalPages || 0));
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };
  const handleFavoriteClick = async (imageId, isFavorite) => {
    try {
      const response = await fetch("/api/manage-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggleFavorite",
          imageId,
          isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      setImages((prev) =>
        (prev || []).map((img) =>
          img?.id === imageId ? { ...img, is_favorite: isFavorite } : img
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <></>

      <main className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <ImageGrid
            images={images}
            onLoadMore={handleLoadMore}
            loading={loading}
            hasMore={hasMore}
            onFavoriteClick={handleFavoriteClick}
          />
        </div>

        <div className="py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold font-inter text-gray-900 dark:text-white mb-6">
              Welcome to AI Art Gallery
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the intersection of artificial intelligence and creativity
              through our curated collection of AI-generated artwork.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <i className="fa fa-paint-brush text-4xl text-blue-500 mb-4"></i>
              <h2 className="text-2xl font-bold font-inter text-gray-900 dark:text-white mb-4">
                AI-Generated Art
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Experience unique pieces created through advanced AI algorithms,
                pushing the boundaries of artistic expression.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <i className="fa fa-magic text-4xl text-purple-500 mb-4"></i>
              <h2 className="text-2xl font-bold font-inter text-gray-900 dark:text-white mb-4">
                Creative Innovation
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Discover how AI technology is revolutionizing the art world and
                opening new possibilities for creative expression.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <i className="fa fa-heart text-4xl text-red-500 mb-4"></i>
              <h2 className="text-2xl font-bold font-inter text-gray-900 dark:text-white mb-4">
                Curated Collection
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Browse through our carefully selected collection of AI artworks,
                each piece telling its own unique story.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .hover\:-translate-y-1:hover {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;


