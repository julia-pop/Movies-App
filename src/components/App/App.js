import { Component } from 'react';
import { Alert } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import MovieDBapi from '../../services/MovieDBapi';
import MovieList from '../MovieList';
import SearchPanel from '../SearchPanel';
import PaginationComponent from '../Pagination';
import Loader from '../Loader';
import { Provider } from '../../services/Context';
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList: [],
            loading: true,
            searchTerm: '',
            error: null,
            currentPage: 1,
            totalResults: 0,
            guestSessionId: null,
            userRatings: {},
            showOnlyRated: false,
            searchPage: 1,
            ratedPage: 1,
        };
        this.movieDBApi = new MovieDBapi();
    }

    componentDidMount() {
        this.movieDBApi.createGuestSession().then((sessionId) => {
            this.setState({ guestSessionId: sessionId });
            this.fetchAndSetMovies();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { currentPage, showOnlyRated } = this.state;

        if (currentPage !== prevState.currentPage) {
            if (showOnlyRated) {
                this.fetchRatedMovies();
            } else {
                this.fetchAndSetMovies();
            }
        }
    }

    fetchAndSetMovies = async () => {
        window.scrollTo(0, 0);
        this.setState({ loading: true, error: null });
        const { searchTerm, currentPage } = this.state;
        this.performMovieFetch(searchTerm, currentPage);
    };

    performMovieFetch = async (searchTerm, page) => {
        try {
            const allGenres = await this.movieDBApi.getGenres();
            const data = searchTerm
                ? await this.movieDBApi.searchMovies(searchTerm, page)
                : await this.movieDBApi.getPopularMovies(page);

            const moviesWithGenres = data.results.map((movie) => ({
                ...movie,
                genres: movie.genre_ids.map((genreId) =>
                    allGenres.find((genre) => genre.id === genreId),
                ),
            }));

            const moviesWithGenresAndRating = await Promise.all(
                moviesWithGenres.map(async (movie) => ({
                    ...movie,
                    rating: await this.calculateRating(movie.id),
                })),
            );

            this.setState({
                movieList: moviesWithGenresAndRating,
                loading: false,
                totalResults: data.total_results,
                currentPage: page,
                showOnlyRated: false,
            });
        } catch (error) {
            this.setState({ error: 'Error fetching movies!', loading: false });
        }
    };

    calculateRating = async (movieId) => {
        try {
            const movie = await this.movieDBApi.getMovie(movieId);
            return movie.vote_average;
        } catch (error) {
            return 0;
        }
    };

    handleSearch = (searchTerm) => {
        this.setState(
            (prevState) => ({
                searchTerm,
                currentPage:
                    searchTerm !== prevState.searchTerm ? 1 : prevState.searchPage,
                searchPage:
                    searchTerm !== prevState.searchTerm ? 1 : prevState.searchPage,
                showOnlyRated: false,
            }),
            this.fetchAndSetMovies,
        );
    };

    handleRatedTab = () => {
        this.setState(
            (prevState) => ({
                currentPage: prevState.ratedPage,
                showOnlyRated: true,
            }),
            this.fetchRatedMovies,
        );
    };

    handlePageChange = (page) => {
        this.setState((prevState) => ({
            currentPage: page,
            ...(prevState.showOnlyRated ? { ratedPage: page } : { searchPage: page }),
        }));
    };

    fetchRatedMovies = async () => {
        window.scrollTo(0, 0);
        this.setState({ loading: true });

        const { userRatings, currentPage, error } = this.state;
        const ratedMovieIds = Object.keys(userRatings);
        const pageSize = 20;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const currentRatedMovieIds = ratedMovieIds.slice(startIndex, endIndex);

        const ratedMoviesWithDetails = await Promise.all(
            currentRatedMovieIds.map(async (movieId) => {
                const movie = await this.movieDBApi.getMovie(movieId);
                return { ...movie, rating: userRatings[movieId] };
            }),
        );

        this.setState({
            movieList: ratedMoviesWithDetails,
            loading: false,
            error: ratedMoviesWithDetails.length === 0 ? null : error,
            showOnlyRated: true,
            totalResults: ratedMovieIds.length,
        });
    };

    handleRatingChange = (movieId, newRating) => {
        this.setState((prevState) => ({
            userRatings: {
                ...prevState.userRatings,
                [movieId]: newRating,
            },
        }));
    };

    render() {
        const {
            movieList,
            loading,
            error,
            currentPage,
            totalResults,
            guestSessionId,
            userRatings,
        } = this.state;

        return (
            <Provider value={movieList}>
                <div className="app">
                    <Offline>
                        <Alert
                            message="No internet connection"
                            type="warning"
                            showIcon
                            closable
                        />
                    </Offline>
                    <Online>
                        <SearchPanel
                            onSearch={this.handleSearch}
                            onRated={this.handleRatedTab}
                        />
                        {loading && <Loader />}
                        {!loading && !error && (
                            <MovieList
                                guestSessionId={guestSessionId}
                                movieDBApi={this.movieDBApi}
                                onRatingChange={this.handleRatingChange}
                                userRatings={userRatings}
                            />
                        )}
                        {!loading && !error && (
                            <PaginationComponent
                                current={currentPage}
                                total={totalResults}
                                onChange={this.handlePageChange}
                            />
                        )}
                    </Online>
                </div>
            </Provider>
        );
    }
}