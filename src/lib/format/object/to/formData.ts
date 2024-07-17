export const formData = (object: { [key: string]: any }) =>
	Object.keys(object).reduce((formData, key) => {
		formData.append(key, object[key]);
		return formData;
	}, new FormData());
