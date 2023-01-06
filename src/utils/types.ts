type JSONPrimitive = string | number | boolean | null;
type JSONObject = { [k: string]: JSONValue };
type JSONArray = JSONValue[];
export type JSONValue = JSONArray | JSONObject | JSONPrimitive;
