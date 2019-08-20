import React, { useState, useEffect } from "react";
import { flushSync } from 'react-dom';
import Scheduler, {unstable_scheduleCallback} from "scheduler";
import _ from 'lodash';
import Charts from './Charts';
import Clock from './Clock';
import { ENABLE_CONCURRENT_AND_SCHEDULED } from './index';
import "./App.css";

let cachedData = new Map();

export default function App() {

    const [state, setState] = useState({
        value: '',
        strategy: 'sync',
        showDemo: true,
        showClock: false,
    });

    let _ignoreClick;
    // Random data for the chart
    const getStreamData = input => {

        if (cachedData.has(input)) {
            return cachedData.get(input);
        }

        const multiplier = input.length !== 0 ? input.length : 1;
        const complexity = (parseInt(window.location.search.substring(1), 10) / 100) * 25 || 25;

        const data = _.range(5).map(t => _.range(complexity * multiplier).map((j, i) => {
                return {x: j, y: (t + 1) * _.random(0, 255)};
            })
        );

        cachedData.set(input, data);
        return data;
    }

    useEffect(() => {
        window.addEventListener('keydown', e => {
            if (e.key.toLowerCase() === '?') {
                e.preventDefault();
                setState(state => ({
                    showClock: !state.showClock
                }));
            }
        });
        
        return () => {
            window.removeEventListener('keydown');
        };
    }, []);

    const handleChartClick = e => {
        if (state.showDemo) {
            if (e.shiftKey) {
                setState({ ...state, showDemo: false });
            }
            return;
        }
        if (state.strategy !== 'async') {
            flushSync(() => {
                setState(state => ({
                    showDemo: !state.showDemo
                }));
            });
            return;
        }

        if (_ignoreClick) {
            return;
        }
        _ignoreClick = true;

        Scheduler.unstable_next(() => {
            setState({ showDemo: true });//, () => {this._ignoreClick = false;}
        });
    };

    const debouncedHandleChange = _.debounce(value => {

        if (state.strategy === 'debounced') {
            flushSync(() => {
                setState({ ...state, value: value });
            });
        }
    }, 1000);

    const renderOption = (strategy, label) => {

        const currentStrategy = state.strategy;

        return (
            <label className={strategy === currentStrategy ? 'selected' : null}>
                <input
                    type="radio"
                    checked={strategy === currentStrategy}
                    onChange={() => setState({ ...state, strategy })}
                />
                {label}
            </label>
        );
    }

    const handleChange = e => {

        const value = e.target.value;

        switch (state.strategy) {
            case 'sync':
                setState({ ...state, value });
                break;
            case 'debounced':
                debouncedHandleChange(value);
                break;
            case 'async':
                unstable_scheduleCallback(() => {
                    setState({ ...state, value });
                });
                break;
            default:
                break;
        }
    };
    
    const data = getStreamData(state.value);

    return (
        <div className="container">
            <div className="rendering">
                {renderOption('sync', 'Synchronous')}
                {renderOption('debounced', 'Debounced')}
                {renderOption('async', 'Concurrent')}
            </div>
            <input
                className={'input ' + state.strategy}
                placeholder="longer input → more components and DOM nodes"
                defaultValue={state.input}
                onChange={handleChange}
            />
            <div className="demo" onClick={handleChartClick}>
                {state.showDemo && (
                    <Charts data={data} onClick={handleChartClick} />
                )}
                <div style={{ display: state.showClock ? 'block' : 'none' }}>
                    <Clock />
                </div>
            </div>
        </div>
    );
}

