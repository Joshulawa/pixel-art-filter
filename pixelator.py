from PIL import Image
import json

#Load image.
filename = 'kanye.jpg'
with Image.open('./resources/' + filename) as img:
    width, height = img.size
    pix_val = list(img.getdata())

#Defines height and width of an Image.
pixelPerRow = 100
pixelWidth = width // pixelPerRow
pixelHeight = height // pixelPerRow

#Put pixel values into a list of rows.
img_pixels = []
row = []
for i, v in enumerate(pix_val):
    #row.append(v)
    if (i == (width * height) - 1):
        row.append(v)
        img_pixels.append(row)
        row = []
    elif (i % width == 0 and i != 0):
        img_pixels.append(row)
        row = []
    row.append(v)

#print(len(img_pixels[0]), " ",len(img_pixels[20]), " ", len(img_pixels[1199]))
#Go through pixel values and get the sum of the values for a grouping of pixels. Then average it. 
#This method seems quite slow... How to optimise? Threads?
pixelAvgs = []
for i in range(pixelPerRow):
    for j in range(pixelPerRow):
        pixelSum = (0,0,0)
        for a in range(pixelHeight):
            for b in range(pixelWidth):
                #Add each pixel tuple to the pixel sum.
                pixelSum = tuple(map(lambda x, y : x+y, pixelSum, img_pixels[i * pixelHeight + a][j * pixelWidth + b])) 
        pixelSumAvg = tuple(map(lambda x : x / (pixelHeight*pixelWidth), pixelSum))
        pixelAvgs.append(pixelSumAvg)

with open('pixelAvgs.json', 'w') as f:
    f.write(json.dumps({'pxlPerRow': pixelPerRow, 'pxlHeight': pixelHeight, 'pxlWidth': pixelWidth, 'avgs': pixelAvgs}))

#print(len(pixelAvgs))
