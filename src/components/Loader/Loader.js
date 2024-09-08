import { Spin } from 'antd';
import './Loader.css';

export default function Loader() {
    return (
        <div className="example">
            <Spin className="loader" tip="Loading...">
                <div className="content" />
            </Spin>
        </div>
    );
}