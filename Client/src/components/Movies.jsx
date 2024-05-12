import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMovies, deleteMovieById, fetchMovieReviews } from "../api";

export default function AllMovies({ isAdmin }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllMoviesHandler() {
      try {
        const moviesData = await getAllMovies();
        const moviesWithReviews = await Promise.all(
          moviesData.map(async (movie) => {
            const reviews = await fetchMovieReviews(movie.id);
            return {
              ...movie,
              reviews: reviews || []
            };
          })
        );
        setMovies(moviesWithReviews);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
    getAllMoviesHandler();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteMovieById(movieId);
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      ); // Remove deleted movie from state
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <div className="bg-dark">
        <div className="container py-4">
          <h1 className="text-light">ReelRave</h1>
          <h2 className="text-light mb-4">
            Cinematic Chronicles: Your Ultimate Destination for Film Reviews and
            Insights!
          </h2>
          <input
            type="text"
            className="form-control-sm mb-3"
            placeholder="Search Movies"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="black-background">
        <div className="container">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {movies
              .filter((movie) =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((movie) => {
                const {
                  id,
                  title,
                  poster_url,
                  category,
                  release_date,
                  reviews
                } = movie;
                return (
                  <div key={id} className="col">
                    <div
                      className="card h-100"
                      style={{ backgroundColor: "#333", color: "white" }}
                    >
                      <img
                        src={poster_url}
                        alt={title}
                        className="card-img-top img-fluid"
                        style={{ maxHeight: "300px" }}
                      />
                      <div className="card-body p-2">
                        <h5 className="card-title" style={{ color: "cyan" }}>
                          {title}
                        </h5>
                        <p className="card-text">
                          <strong style={{ color: "yellow" }}>Category:</strong>{" "}
                          {category}
                        </p>
                        <p className="card-text">
                          <strong style={{ color: "orange" }}>
                            Release Date:
                          </strong>{" "}
                          {release_date}
                        </p>
                        <div>
                          <strong style={{ color: "green" }}>
                            Average Rating:
                          </strong>{" "}
                          {calculateAverageRating(reviews)}
                        </div>
                      </div>
                      <div className="card-footer p-2">
                        {isAdmin ? (
                          <button
                            onClick={() => handleDeleteMovie(id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete Movie
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/movies/${id}`)}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: "purple" }}
                          >
                            See Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
