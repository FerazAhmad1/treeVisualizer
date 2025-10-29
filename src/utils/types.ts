export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
    [Key: string]: JSONValue
}

export type JSONArray = Array<JSONValue>

export interface TreeViewProps {
    jsonInput: JSONObject | null;
}