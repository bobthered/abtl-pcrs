export const object = (formData: FormData): { [key: string]: string } =>
	<{ [key: string]: string }>Object.fromEntries(formData);
