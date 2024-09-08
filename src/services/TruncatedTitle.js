import { Component } from 'react';
import PropTypes from 'prop-types';
import TrimText from './TrimText';

export default class TruncatedTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenWidth: window.innerWidth,
        };
    }

    componentDidMount() {
        this.updateScreenWidth();
        window.addEventListener('resize', this.updateScreenWidth);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateScreenWidth);
    }

    updateScreenWidth = () => {
        this.setState({ screenWidth: window.innerWidth });
    };

    render() {
        const { title } = this.props;
        const { screenWidth } = this.state;

        const maxTitleLength = screenWidth <= 450 ? 25 : 35;
        const shortTitle = TrimText(title, maxTitleLength);

        return <h5 className="movieTitle">{shortTitle}</h5>;
    }
}

TruncatedTitle.propTypes = {
    title: PropTypes.string.isRequired,
};