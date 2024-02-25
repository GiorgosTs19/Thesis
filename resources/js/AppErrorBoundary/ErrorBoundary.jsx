import {Component} from 'react';
import {arrayOf, node, oneOfType} from "prop-types";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service
        console.error('Error caught by Error Boundary:', error, errorInfo);
        // You can also set a flag to display a fallback UI
        this.setState({hasError: true});
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;

ErrorBoundary.propTypes = {
    children: oneOfType([node, arrayOf(node)])
}
