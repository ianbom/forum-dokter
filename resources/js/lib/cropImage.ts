export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    fileName: string = 'cropped.jpg'
): Promise<File | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    // set canvas size to match the bounding box
    canvas.width = image.width
    canvas.height = image.height

    // draw image
    ctx.drawImage(image, 0, 0)

    // extract the cropped image data
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated crop image at the top left corner
    ctx.putImageData(data, 0, 0)

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) {
                resolve(new File([file], fileName, { type: 'image/jpeg' }))
            } else {
                reject(new Error('Canvas is empty'))
            }
        }, 'image/jpeg')
    })
}
