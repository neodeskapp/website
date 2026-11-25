// A small ZIP writer for the brand page's download: every file of a folder, deflated,
// with a fixed date, so the same files always give the same archive.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/** Every file under a folder, as [path inside the archive, data], sorted. */
function filesOf(dir: string, prefix: string): [string, Buffer][] {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.sort((a, b) => a.name.localeCompare(b.name))
		.flatMap((e): [string, Buffer][] =>
			e.isDirectory() ? filesOf(path.join(dir, e.name), `${prefix}${e.name}/`) : [[`${prefix}${e.name}`, fs.readFileSync(path.join(dir, e.name))]]
		);
}

/** A ZIP archive of a folder; `root` is the folder name inside the archive. */
export function zipFolder(dir: string, root: string): Buffer {
	// 1 January 2026, 00:00, in MS-DOS time and date
	const time = 0;
	const date = ((2026 - 1980) << 9) | (1 << 5) | 1;
	const local: Buffer[] = [];
	const central: Buffer[] = [];
	let offset = 0;
	for (const [name, data] of filesOf(dir, `${root}/`)) {
		const nameBuf = Buffer.from(name, 'utf8');
		const deflated = zlib.deflateRawSync(data, { level: 9 });
		const stored = deflated.length >= data.length;
		const body = stored ? data : deflated;
		const crc = zlib.crc32(data);
		const head = Buffer.alloc(30);
		head.writeUInt32LE(0x04034b50, 0);
		head.writeUInt16LE(20, 4);
		head.writeUInt16LE(0x0800, 6); // names in UTF-8
		head.writeUInt16LE(stored ? 0 : 8, 8);
		head.writeUInt16LE(time, 10);
		head.writeUInt16LE(date, 12);
		head.writeUInt32LE(crc, 14);
		head.writeUInt32LE(body.length, 18);
		head.writeUInt32LE(data.length, 22);
		head.writeUInt16LE(nameBuf.length, 26);
		head.writeUInt16LE(0, 28);
		local.push(head, nameBuf, body);
		const entry = Buffer.alloc(46);
		entry.writeUInt32LE(0x02014b50, 0);
		entry.writeUInt16LE(20, 4);
		entry.writeUInt16LE(20, 6);
		entry.writeUInt16LE(0x0800, 8);
		entry.writeUInt16LE(stored ? 0 : 8, 10);
		entry.writeUInt16LE(time, 12);
		entry.writeUInt16LE(date, 14);
		entry.writeUInt32LE(crc, 16);
		entry.writeUInt32LE(body.length, 20);
		entry.writeUInt32LE(data.length, 24);
		entry.writeUInt16LE(nameBuf.length, 28);
		entry.writeUInt32LE(offset, 42);
		central.push(entry, nameBuf);
		offset += head.length + nameBuf.length + body.length;
	}
	const centralBuf = Buffer.concat(central);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(central.length / 2, 8);
	end.writeUInt16LE(central.length / 2, 10);
	end.writeUInt32LE(centralBuf.length, 12);
	end.writeUInt32LE(offset, 16);
	return Buffer.concat([...local, centralBuf, end]);
}
