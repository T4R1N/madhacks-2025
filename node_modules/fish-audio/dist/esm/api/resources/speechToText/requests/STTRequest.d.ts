export interface STTRequest {
    audio: File;
    language?: string;
    ignore_timestamps?: boolean;
}
