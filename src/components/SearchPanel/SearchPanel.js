import { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import './SearchPanel.css';

export default class SearchPanel extends Component {
    constructor(props) {
        super(props);

        const { onSearch } = this.props;
        this.debouncedOnSearch = debounce(onSearch, 1000);

        this.state = {
            activeButton: 'search',
            searchTerm: '',
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick = (buttonName) => {
        this.setActiveButton(buttonName);

        const { onSearch, onRated } = this.props;
        const { searchTerm } = this.state;

        if (buttonName === 'search') {
            onSearch(searchTerm);
        } else {
            onRated();
        }
    };

    handleSearchChange(event) {
        const searchTerm = event.target.value;
        this.setState({ searchTerm });

        if (searchTerm.trim() || searchTerm === '') {
            this.debouncedOnSearch(searchTerm.trim());
        }
    }

    setActiveButton = (buttonName) => {
        this.setState({ activeButton: buttonName });
    };

    render() {
        const { activeButton, searchTerm } = this.state;
        return (
            <div className="search-panel">
                <div className="button-box">
                    <button
                        className={`search-btn ${activeButton === 'search' ? 'active' : ''}`}
                        type="button"
                        onClick={() => this.handleButtonClick('search')}
                    >
                        Search
                    </button>
                    <button
                        className={`rated-btn ${activeButton === 'rated' ? 'active' : ''}`}
                        type="button"
                        onClick={() => this.handleButtonClick('rated')}
                    >
                        Rated
                    </button>
                </div>
                {activeButton === 'search' && (
                    <Input
                        className="search-input"
                        placeholder="Type to search..."
                        value={searchTerm}
                        onChange={this.handleSearchChange}
                    />
                )}
            </div>
        );
    }
}

SearchPanel.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onRated: PropTypes.func.isRequired,
};