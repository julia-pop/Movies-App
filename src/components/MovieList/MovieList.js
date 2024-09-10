import PropTypes from 'prop-types';
import MovieCard from '../MovieCard';
import { Consumer } from '../../services/Context';
import './MovieList.css';

export default function MovieList({
    guestSessionId,
    movieDBApi,
    onRatingChange,
    userRatings,
}) {
    return (
        <Consumer>
            {(movieList) => (
                <div className="movie-list">
                    {movieList.length > 0 ? (
                        movieList.map((movie) => (
                            <MovieCard
                            key={movie.id}
                            genresID={movie.genre_ids}
                            movieId={movie.id}
                            movieTitle={movie.title}
                            releaseDate={movie.release_date}
                            description={movie.overview}
                            imgPath={movie.poster_path}
                            rating={movie.vote_average}
                            movieDBApi={movieDBApi}
                            guestSessionId={guestSessionId}
                            userRating={userRatings[movie.id]}
                            onRatingChange={onRatingChange}
                            genres={movie.genres.map((genre) => ({
                                id: genre.id,
                                name: genre.name,
                                }))}
                            />
                        ))
                    ) : (
                        <p className="empty-result">No movies found.</p>
                    )}
                </div>
            )}
        </Consumer>
    );
}

MovieList.propTypes = {
    guestSessionId: PropTypes.string.isRequired,
    movieDBApi: PropTypes.shape({
        rateMovie: PropTypes.func.isRequired,
    }).isRequired,
    onRatingChange: PropTypes.func.isRequired,
    userRatings: PropTypes.objectOf(PropTypes.number).isRequired,
};
