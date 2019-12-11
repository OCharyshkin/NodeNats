import IDataConverter from "./data-converter.interface";

class DataConverter implements IDataConverter {

    private static max_data_length = 20;

    async convert(data: string): Promise<string> {

        const processSingleChunk = (chunk: string) => chunk.toUpperCase();

        return new Promise((resolve) => {

            let convertedData = '';

            let page = 0;

            while (page * DataConverter.max_data_length < data.length) {

                const singleChunk = data.slice(page * DataConverter.max_data_length, (page + 1) * DataConverter.max_data_length);

                setImmediate(() => {
                    convertedData += processSingleChunk(singleChunk);
                });

                page++;
            }

            setImmediate(() => resolve(convertedData));
        });

    }
}

export default DataConverter;