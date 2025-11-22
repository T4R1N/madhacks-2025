export interface ModelCreateRequest {
    type?: 'tts';
    title: string;
    train_mode?: 'fast';
    voices: File[];
    visibility?: 'public' | 'unlist' | 'private';
    description?: string;
    cover_image?: File;
    texts?: string[];
    tags?: string[];
    enhance_audio_quality?: boolean;
}
