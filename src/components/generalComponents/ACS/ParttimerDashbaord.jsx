import { Videos } from "../../organisms/Videos";
import { StatusCalendar } from "../../templates/StatusCalender";
import StatusUpdates from "../StatusUpdates";



const ParttimerDashboard = () => {
    return (
        <div>
            <StatusUpdates />
            <Videos />
        </div>
    );
};

export default ParttimerDashboard;