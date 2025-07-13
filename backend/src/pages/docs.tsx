import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const DocsPage: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>API 문서</h1>
            <SwaggerUI url="/api/docs" />
        </div>
    );
};

export default DocsPage; 