import DataSender from "../../services/data-sender";
import FileReaderStub from "../stubs/data-retrieving/file-reader.stub";
import ChannelSenderProvider from "../../services/channel-senders/channel-sender-provider";
import DataToSend from "../../models/sending/data-to-send";
import ChannelType from "../../models/sending/channel-type";
import ChannelSenderStub from "../stubs/channels-senders/channel-sender.stub";
import ChannelDefinition from "../../models/channels/channel-definition";
import DataType from "../../models/sending/portions/data-type";
import HeadPayload from "../../models/sending/portions/payloads/head-payload";
import BodyPayload from "../../models/sending/portions/payloads/body-payload";

describe('Sender service', () => {

    const fileReader = new FileReaderStub();
    const channelProvider = new ChannelSenderProvider();
    const sender = new DataSender(channelProvider, fileReader);
    const channelSender = new ChannelSenderStub();
    channelProvider.addChannel(new ChannelDefinition(ChannelType.nats, () => channelSender));

    beforeEach(() => {
        channelSender.clearSent();
        fileReader.clearChunksToSend();
    });

    describe('Sending via Channel', () => {

        it('Three portions sent', async () => {

            const dataToSend = new DataToSend(ChannelType.nats, 'test');

            await sender.send(dataToSend);

            const sentPortions = channelSender.getSentPortions();

            expect(sentPortions.length).toBe(3);
        });

        it('Portions sent in correct order with the same session', async () => {

            const dataToSend = new DataToSend(ChannelType.nats, 'test');

            await sender.send(dataToSend);

            const sentPortions = channelSender.getSentPortions();

            expect(sentPortions[0].type).toBe(DataType.head);
            expect(sentPortions[1].type).toBe(DataType.body);
            expect(sentPortions[2].type).toBe(DataType.end);

            expect(sentPortions[0].sessionId).not.toBeNull();

            expect(sentPortions[0].sessionId).toBe(sentPortions[1].sessionId);
            expect(sentPortions[2].sessionId).toBe(sentPortions[1].sessionId);

        });

        it('Head is correct', async () => {

            const dataToSend = new DataToSend(ChannelType.nats, 'test');

            await sender.send(dataToSend);

            const sentPortions = channelSender.getSentPortions();

            const payload = <HeadPayload>sentPortions[0].payload;

            expect(payload.fileName).toBe('test');
        });

        it('Body is correct', async () => {

            fileReader.setDataToSend('test-data')

            const dataToSend = new DataToSend(ChannelType.nats, 'test');

            await sender.send(dataToSend);

            const sentPortions = channelSender.getSentPortions();

            const payload = <BodyPayload>sentPortions[1].payload;

            expect(payload.data).toBe('test-data');
        });

        it('All body\' chunks are sent', async () => {

            fileReader.setDataToSend('test-data1');
            fileReader.addDataToSend('test-data2');

            const dataToSend = new DataToSend(ChannelType.nats, 'test');

            await sender.send(dataToSend);

            const sentPortions = channelSender.getSentPortions();

            expect(sentPortions.length).toBe(4);

            expect(sentPortions[1].sequence).toBe(0);
            expect((<BodyPayload>sentPortions[1].payload).data).toBe('test-data1');

            expect(sentPortions[2].sequence).toBe(1);
            expect((<BodyPayload>sentPortions[2].payload).data).toBe('test-data2');
        });

    });
});