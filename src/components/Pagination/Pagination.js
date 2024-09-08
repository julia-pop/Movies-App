import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import './Pagination.css';

export default function PaginationComponent({ current, total, onChange }) {
    const pageSize = 20;
    const maxPages = 500;
    const maxTotal = pageSize * maxPages;
    const adjustedTotal = Math.min(total, maxTotal);
    const shouldShowPagination = !(current === 1 && total <= pageSize);

    return (
        shouldShowPagination && (
            <Pagination
                current={current}
                total={adjustedTotal}
                onChange={onChange}
                pageSize={pageSize}
                showSizeChanger={false}
            />
        )
    );
}

PaginationComponent.propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};