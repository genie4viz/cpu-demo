import React, { useState } from "react";

import {
    unstable_LowPriority,
    unstable_next,
    unstable_runWithPriority,
    unstable_scheduleCallback
} from "scheduler";

import {ENABLE_CONCURRENT_AND_SCHEDULED} from './index';

import "./App.css";

export default function App() {
    const [searchValue, setSearchValue] = useState("");
    const handleChange = value => {
        setSearchValue(value);
    }

    return (
        <div className="App">
            
        </div>
    );
}

