// src/schema/loadSchema.ts
// Utility to fetch a schema from a local public/data path

export async function loadSchemaByName(name: string): Promise<any> {
  const url = `/data/${name}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to load schema: ' + name);
  return await response.json();
}
