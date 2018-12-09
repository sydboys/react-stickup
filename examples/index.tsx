import * as React from 'react';
import { render } from 'react-dom';
import { ObserveViewport } from 'react-viewport-utils';

import { Sticky, StickyScrollUp, StickyProvider } from '../lib/index';

import './styles.css';

const Placeholder = () => <div className="placeholder" />;

class Example extends React.PureComponent<{}, { disableHeader: boolean }> {
  private container1: React.RefObject<any>;
  private container2: React.RefObject<any>;
  private container3: React.RefObject<any>;
  private container4: React.RefObject<any>;
  private container5: React.RefObject<any>;
  private container6: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.container1 = React.createRef();
    this.container2 = React.createRef();
    this.container3 = React.createRef();
    this.container4 = React.createRef();
    this.container5 = React.createRef();
    this.container6 = React.createRef();
    this.state = {
      disableHeader: false,
    };
  }

  toggleHeaderState() {
    this.setState({
      disableHeader: !this.state.disableHeader,
    });
  }

  render() {
    return (
      <>
        <ObserveViewport disableDimensionsUpdates priority="low">
          {({ scroll }) => (
            <div className="scrollPosition">
              <div>
                {scroll.x.toFixed(2)}x{scroll.y.toFixed(2)}
              </div>
              <button onClick={() => this.toggleHeaderState()}>
                Toggle Header Active State
              </button>
            </div>
          )}
        </ObserveViewport>
        <Placeholder />

        <StickyScrollUp
          className="header-container"
          disabled={this.state.disableHeader}
        >
          {({ isSticky, isNearToViewport }) => (
            <div className="header">
              Header isNearToViewport: {isNearToViewport ? 'true' : 'false'},
              isSticky: {isSticky ? 'true' : 'false'}
            </div>
          )}
        </StickyScrollUp>
        <Placeholder />

        <div ref={this.container1}>
          <Sticky container={this.container1} style={{ marginTop: 100 }}>
            <div className="sticky-inline">style: marginTop: 100</div>
          </Sticky>
          <Placeholder />
        </div>

        <div ref={this.container2}>
          <Sticky
            container={this.container2}
            stickyProps={{ className: 'sticky-placeholder' }}
          >
            {({ isSticky, isDockedToBottom, isNearToViewport }) => (
              <div className="sticky-inline sticky-inline-odd">
                stickyProps: paddingBottom: 100
                <br />
                isSticky: {isSticky ? 'true' : 'false'}
                <br />
                isDockedToBottom: {isDockedToBottom ? 'true' : 'false'}
                <br />
                isNearToViewport: {isNearToViewport ? 'true' : 'false'}
              </div>
            )}
          </Sticky>
          <Placeholder />
        </div>

        <div className="wrapper" ref={this.container3}>
          <Sticky container={this.container3}>
            <div className="sticky-inline">default props</div>
          </Sticky>
          <Placeholder />
        </div>

        <div ref={this.container4}>
          <Sticky container={this.container4} defaultOffsetTop={100}>
            <div className="sticky-inline sticky-inline-odd">
              defaultOffsetTop: 100
            </div>
          </Sticky>
          <Placeholder />
        </div>

        <div
          className="placeholder"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div ref={this.container5} style={{ width: '25%' }}>
            <Sticky container={this.container5} overflowScroll="flow">
              <div className="sticky-inline sticky-inline-sidebar">
                overflowScroll="flow"
                <br />
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </Sticky>
          </div>
          <div ref={this.container6} style={{ width: '25%' }}>
            <Sticky container={this.container6} overflowScroll="end">
              <div className="sticky-inline sticky-inline-sidebar">
                overflowScroll="end"
                <br />
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </Sticky>
          </div>
        </div>

        <Sticky disableHardwareAcceleration>
          <div className="sticky-inline">disableHardwareAcceleration: true</div>
        </Sticky>

        <Placeholder />
        <Placeholder />
        <Placeholder />
      </>
    );
  }
}

render(
  <React.StrictMode>
    <StickyProvider>
      <main role="main">
        <Example />
        <Placeholder />
        <Placeholder />
        <Placeholder />
      </main>
    </StickyProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
