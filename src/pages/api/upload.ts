import fs from 'fs';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
	api: {
		bodyParser: false,
	},
};

const saveFile = async (dir: string, file: any) => {
	const data = fs.readFileSync(file.path);
	fs.writeFileSync(`./public/${dir}/${file.name}`, data);
	await fs.unlinkSync(file.path);
	return;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(404).send('');
	}

	const form = new formidable.IncomingForm();

	form.parse(req, async function (err: any, fields: any, files: any) {
		await saveFile(fields['dir'], files.file);
		return res.status(201).send({ url: `./public/${fields['dir']}/${files.file.name}` });
	});
};
