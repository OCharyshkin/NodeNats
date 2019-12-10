class DataConverter {

    async convert(data: string): Promise<string> {

        return Promise.resolve(data.toUpperCase());
    }
}

export default DataConverter;