import { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate } from 'antd';
import TrimText from '../../services/TrimText';
import TruncatedTitle from '../../services/TruncatedTitle';
import './MovieCard.css';

export default class MovieCard extends Component {
    handleRatingChange = (newRating) => {
        const { movieId, movieDBApi, guestSessionId, onRatingChange } = this.props;
        movieDBApi.rateMovie(movieId, newRating, guestSessionId).then(() => {
            onRatingChange(movieId, newRating);
        });
    };

    getRatingClass = () => {
        const { rating } = this.props;
        if (rating >= 7) return 'rating-high';
        if (rating >= 5) return 'rating-mid';
        if (rating >= 3) return 'rating-low';
        return 'rating-very-low';
    };

    render() {
        const { movieTitle, description, releaseDate, rating, genres, userRating } =
            this.props;

        let { imgPath } = this.props;
        if (!imgPath) {
            imgPath =
                'https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.svg';
        }

        const formattedDate = releaseDate
            ? format(new Date(releaseDate), 'MMMM d, yyyy')
            : null;
        const shortDesc = TrimText(description, 170);
        const imgSrc = imgPath.startsWith('http')
            ? imgPath
            : `https://image.tmdb.org/t/p/w500/${imgPath}`;
        const genresElement = genres
            .map((genreItem) => (
                <li key={genreItem.id} className="genresList__item">
                    {genreItem.name}
                </li>
            ))
            .slice(0, 3);

        return (
            <li className="movieCard">
                <img className="movieImg" src={imgSrc} alt={movieTitle} />
                <div className="movieCardContent">
                    <TruncatedTitle title={movieTitle} />
                    <span className="releaseDate">{formattedDate}</span>
                    <ul className="genresList">{genresElement}</ul>
                    <p className="description">{shortDesc}</p>
                    <Rate
                        value={userRating}
                        count={10}
                        allowHalf
                        className="movie-rating"
                        onChange={this.handleRatingChange}
                    />
                    <div className={`ratingCircle ${this.getRatingClass(rating)}`}>
                        {rating.toFixed(1)}
                    </div>
                </div>
            </li>
        );
    }
}

MovieCard.propTypes = {
    movieTitle: PropTypes.string.isRequired,
    description: PropTypes.string,
    releaseDate: PropTypes.string.isRequired,
    rating: PropTypes.number,
    genres: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onRatingChange: PropTypes.func.isRequired,
    userRating: PropTypes.number,
    movieId: PropTypes.number.isRequired,
    movieDBApi: PropTypes.shape({
        rateMovie: PropTypes.func.isRequired,
    }).isRequired,
    guestSessionId: PropTypes.string.isRequired,
    imgPath: PropTypes.string,
};

MovieCard.defaultProps = {
    description: '',
    rating: 0,
    userRating: 0,
    imgPath: '',
};