export type JSONObject = {
   _tag: 'object';
   value: {
      key: string;
      value: JSON;
   }[];
};

export type JSONArray = {
   _tag: 'array';
   value: Array<JSON>;
};

export type JSONString = {
   _tag: 'string';
   value: string;
};

export type JSONNumber = {
   _tag: 'number';
   value: number;
};

export type JSONBoolean = {
   _tag: 'boolean';
   value: boolean;
};

export type JSONNull = {
   _tag: 'null';
};

export type JSON =
   | JSONObject
   | JSONArray
   | JSONString
   | JSONNumber
   | JSONBoolean
   | JSONNull;

export const JSONObject: (
   objs: {
      key: string;
      value: JSON;
   }[]
) => JSONObject = objs => ({
   _tag: 'object',
   value: objs.map(v => ({
      key: v.key,
      value: v.value,
   })),
});

export const JSONArray: (js: Array<JSON>) => JSONArray = js => ({
   _tag: 'array',
   value: js,
});

export const JSONString: (value: string) => JSONString = v => ({
   _tag: 'string',
   value: v,
});

export const JSONNumber: (value: number) => JSONNumber = v => ({
   _tag: 'number',
   value: v,
});

export const JSONNull: () => JSONNull = () => ({
   _tag: 'null',
});

export const JSONBoolean: (value: boolean) => JSONBoolean = v => ({
   _tag: 'boolean',
   value: v,
});
