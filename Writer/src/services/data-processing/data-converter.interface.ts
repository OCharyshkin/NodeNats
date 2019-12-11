interface IDataConverter {
    convert(data: string): Promise<string>;
}

export default IDataConverter;