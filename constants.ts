// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const bucket: string = process.env.S3_BUCKET!

export interface S3Error {
    Code: string
    $metadata: {
        httpStatusCode: string
    }
}

export const archetypes = {
    initialization: 0,
    stage: 1,
    input: 2,

    tapNote: 3,
    flickNote: 4,
    slideStart: 5,
    slideTick: 6,
    slideEnd: 7,
    slideEndFlick: 8,
    slideConnector: 9,

    criticalTapNote: 10,
    criticalFlickNote: 11,
    criticalSlideStart: 12,
    criticalSlideTick: 13,
    criticalSlideEnd: 14,
    criticalSlideEndFlick: 15,
    criticalSlideConnector: 16,

    slideHiddenTick: 17,
}

export const inputNotes = [
    archetypes.tapNote,
    archetypes.flickNote,
    archetypes.slideStart,
    archetypes.slideTick,
    archetypes.slideEnd,
    archetypes.slideEndFlick,
    archetypes.slideConnector,
    archetypes.criticalTapNote,
    archetypes.criticalFlickNote,
    archetypes.criticalSlideStart,
    archetypes.criticalSlideTick,
    archetypes.criticalSlideEnd,
    archetypes.criticalSlideEndFlick,
    archetypes.criticalSlideConnector,
    archetypes.slideHiddenTick,
]
