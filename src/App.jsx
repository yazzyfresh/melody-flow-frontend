
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Concerts from "./pages/Concerts";
import SavedConcerts from "./pages/SavedConcerts";
import ConcertPlan from "./pages/ConcertPlan";
import Expenses from "./pages/Expenses";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/concerts" element={<Concerts />} />
                <Route path="/saved-concerts" element={<SavedConcerts />} />
                <Route path="/plan" element={<ConcertPlan />} />
                <Route path="/expenses" element={<Expenses />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
