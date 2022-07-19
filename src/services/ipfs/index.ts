import ipfs from '../../utils/ipfs';

export async function add(content: any) {
    const { cid } = await ipfs.add(content);
    return cid;
}

export async function addBatch(contents: any[]) {
    const cids = [];
    for await (const { cid } of ipfs.addAll(contents)) {
        cids.push(cid);
    }
    return cids;
}