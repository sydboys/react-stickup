import * as React from 'react';
import { ObserveBoundingClientRect, IRect } from 'react-viewport-utils';

import {
  connect as connectStickyScrollUpProvider,
  IInjectedProps as IStickyInjectedProps,
} from './StickyScrollUpProvider';
import Placeholder, { IUpdateOptions } from './Placeholder';
import StickyElement from './StickyElement';

import { TRenderChildren, IStickyComponentProps } from './types';

interface IChildrenOptions {
  isSticky: boolean;
  isDockedToBottom: boolean;
}

interface IOwnProps extends IStickyComponentProps<IChildrenOptions> {
  container?: React.RefObject<any>;
}

interface IProps extends IOwnProps, IStickyInjectedProps {}

interface IState {
  isRecalculating: boolean;
  stickyRect: IRect | null;
  containerRect: IRect | null;
}

class Sticky extends React.PureComponent<IProps, IState> {
  private stickyRef: React.RefObject<any>;
  private placeholderRef: React.RefObject<any>;
  static defaultProps = {
    disabled: false,
    stickyOffset: 0,
    stickyProps: {
      style: {},
    },
    disableHardwareAcceleration: false,
    defaultOffsetTop: 0,
  };

  constructor(props: IProps) {
    super(props);

    this.stickyRef = React.createRef();
    this.placeholderRef = React.createRef();
    this.state = {
      containerRect: null,
      stickyRect: null,
      isRecalculating: false,
    };
  }

  get offsetTop() {
    return this.props.stickyOffset + this.props.defaultOffsetTop;
  }

  hasContainer = () => {
    return Boolean(this.props.container);
  };

  isSticky = (rect: IRect | null, containerRect: IRect | null) => {
    if (!rect || !containerRect) {
      return false;
    }

    if (!this.hasContainer()) {
      return containerRect.top <= this.offsetTop;
    }

    if (containerRect.top > this.offsetTop) {
      return false;
    }

    if (containerRect.bottom - this.offsetTop < rect.height) {
      return false;
    }

    return true;
  };

  isDockedToBottom = (rect: IRect | null, containerRect: IRect | null) => {
    if (!rect || !containerRect) {
      return false;
    }

    if (!this.hasContainer()) {
      return false;
    }

    if (containerRect.bottom - this.offsetTop >= rect.height) {
      return false;
    }

    return true;
  };

  calcPositionStyles = (
    rect: IRect,
    containerRect: IRect,
  ): React.CSSProperties => {
    if (this.isSticky(rect, containerRect)) {
      return {
        position: 'fixed',
        top: 0,
      };
    }

    if (this.isDockedToBottom(rect, containerRect)) {
      return {
        position: 'absolute',
        top: containerRect.height - rect.height,
      };
    }

    return {
      position: 'absolute',
      top: 0,
    };
  };

  getStickyStyles(
    rect: IRect | null,
    containerRect: IRect | null,
  ): React.CSSProperties {
    if (!rect || !containerRect) {
      return {};
    }

    const styles = this.calcPositionStyles(rect, containerRect);
    const isSticky = this.isSticky(rect, containerRect);
    const transform = `translateY(${isSticky ? this.offsetTop : 0}px)`;

    if (this.props.disableHardwareAcceleration) {
      styles.transform = transform;
    } else {
      styles.transform = `${transform} translateZ(0)`;
      styles.willChange = 'position, top, transform';
    }

    return styles;
  }

  getRenderArgs() {
    const { children } = this.props;
    const { stickyRect, containerRect } = this.state;
    // in case children is not a function renderArgs will never be used
    const willRenderAsAFunction = typeof children === 'function';
    return {
      isSticky: willRenderAsAFunction
        ? this.isSticky(stickyRect, containerRect)
        : false,
      isDockedToBottom: willRenderAsAFunction
        ? this.isDockedToBottom(stickyRect, containerRect)
        : false,
    };
  }

  handlePlaceholderUpdate = (stickyRect: IRect | null) => {
    this.setState({
      stickyRect,
    });
  };

  handleContainerUpdate = (containerRect: IRect | null) => {
    this.setState({
      containerRect,
    });
  };

  handleRecalculation = (isRecalculating: boolean) => {
    this.setState({
      isRecalculating,
    });
  };

  render() {
    const { children, disabled, stickyProps } = this.props;
    const { stickyRect, containerRect, isRecalculating } = this.state;
    const styles = this.getStickyStyles(stickyRect, containerRect);
    return (
      <>
        <ObserveBoundingClientRect
          node={this.props.container || this.placeholderRef}
          onUpdate={this.handleContainerUpdate}
        />
        <Placeholder
          forwardRef={this.placeholderRef}
          node={this.stickyRef}
          style={this.props.style}
          className={this.props.className}
          disabled={this.props.disabled}
          disableResizing={this.props.disableResizing}
          onUpdate={this.handlePlaceholderUpdate}
          onRecalculationChange={this.handleRecalculation}
        >
          <StickyElement<
            TRenderChildren<{
              isSticky: boolean;
              isDockedToBottom: boolean;
            }>
          >
            forwardRef={this.stickyRef}
            positionStyle={styles}
            disabled={disabled || isRecalculating}
            children={children}
            renderArgs={this.getRenderArgs()}
            {...stickyProps}
          />
        </Placeholder>
      </>
    );
  }
}

export default connectStickyScrollUpProvider()<IOwnProps>(Sticky);