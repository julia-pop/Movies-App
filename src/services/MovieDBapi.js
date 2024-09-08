export default class MovieDBapi {
    baseApi = 'https://api.themoviedb.org/3';

    token = '24d3d28695057d759f135419b87be02e';

    async getResource(url) {
        const res = await fetch(`${this.baseApi}${url}&api_key=${this.token}`);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        }
        return res.json();
    }

    getMovie(id) {
        return this.getResource(`/movie/${id}?`);
    }

    getPopularMovies(page) {
        return this.getResource(`/movie/popular?language=en-US&page=${page}`);
    }

    searchMovies(query, page) {
        return this.getResource(
            `/search/movie?query=${query}&language=en-US&page=${page}`,
        );
    }

    createGuestSession = async () => {
        const response = await this.getResource(
            '/authentication/guest_session/new?language=en-US',
        );
        return response.guest_session_id;
    };

    getGenres = async () => {
        const response = await this.getResource('/genre/movie/list?language=en-US');
        return response.genres;
    };

    rateMovie = async (movieId, rating, guestSessionId) => {
        const url = `/movie/${movieId}/rating?guest_session_id=${guestSessionId}`;
        const response = await fetch(
            `${this.baseApi}${url}&api_key=${this.token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ value: rating }),
            },
        );

        if (!response.ok) {
            throw new Error(
                `Could not post rating for movie ${movieId}, received ${response.status}`,
            );
        }
        return response.json();
    };
}