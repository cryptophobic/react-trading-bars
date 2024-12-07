import { BarsJsonProvider } from "./data/BarsJsonProvider";
import BarsConsumer from "./components/BarsConsumer";

const App = () => {
    return (
        <BarsJsonProvider>
            <BarsConsumer />
        </BarsJsonProvider>
    );
};

export default App;
