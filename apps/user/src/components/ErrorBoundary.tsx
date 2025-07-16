import { Component } from 'react';
import type { ReactNode } from 'react';
import { logError } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logError(error);
  }

  render() {
    if (this.state.hasError) {
      return <h1>문제가 발생했습니다. 새로고침 해주세요.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 