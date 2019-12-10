import IChanelSender from "./chanel-sender.interface";
import DataChanel from "../../models/sending/data-chanel";

interface IChanelSenderProvider {

    get(chanel: DataChanel): IChanelSender;
}

export default IChanelSenderProvider;