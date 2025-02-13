from constants import AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_ACCESS_KEY, S3_ENDPOINT
import os
import glob
import requests
import replicate
import uuid
import time
import json
import boto3
import random
import wget
import subprocess
from dotenv import load_dotenv

load_dotenv()

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
url = "https://api.replicate.com/v1/models/kwaivgi/kling-v1.6-pro/predictions"

headers = {
    "Authorization": f"Bearer {REPLICATE_API_TOKEN}",
    "Content-Type": "application/json",
    "Prefer": "wait"
}


def init_s3_client():
    client = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

    return client


def upload_file_s3(file_path, file_key):
    client = init_s3_client()
    client.upload_file(
        Filename=file_path,
        Bucket=AWS_BUCKET_NAME,
        Key=file_key,
        ExtraArgs={'ACL': 'public-read'}
    )
    return file_key


def create_folder_and_clear_files(folderPath):
    if os.path.exists(folderPath):
        files = glob.glob(f"{folderPath}/*")
        for f in files:
            os.remove(f)
    else:
        os.makedirs(folderPath)


# def generate_scenes(arr, index, s_index):
#     if s_index < len(arr[index]['sceneSubprompts']):
#         print("processing scene - " + str(s_index))
#         if arr[index]['sceneSubprompts'][s_index]['type'] == 'scene':
#             # output = replicate.run(
#             #     "kwaivgi/kling-v1.6-pro",
#             #     input={
#             #         "prompt": arr[index]['sceneSubprompts'][s_index]['text'],
#             #         "duration": 5,
#             #         "cfg_scale": 0.5,
#             #         "start_image": arr[index]['frameSubprompts'][int(s_index/2)]['frameUrl'],
#             #         "aspect_ratio": "16:9",
#             #         "negative_prompt": ""
#             #     }
#             # )
#             output = replicate.run(
#                 "luma/ray",
#                 input={
#                     "loop": False,
#                     "prompt": arr[index]['sceneSubprompts'][s_index]['text'],
#                     "aspect_ratio": "16:9",
#                     # "end_image_url": arr[index]['frameSubprompts'][int((s_index + 1)/2)]['frameUrl'],
#                     "start_image_url": arr[index]['frameSubprompts'][int(s_index/2)]['frameUrl']
#                 }
#             )
#             print(output)
#             ts = time.time()
#             save_file_path = f"videos/video{index}/video_{str(int(ts))}_" + \
#                 f"{uuid.uuid4()}.mp4"
#             response1 = requests.get(output)
#             if response1.status_code == 200:
#                 with open(save_file_path, "wb") as file:
#                     file.write(response1.content)
#                 print(f"Video saved as {save_file_path}")
#                 file_key = f"videos/generation/{save_file_path}"
#                 uploaded_image_url = upload_file_s3(save_file_path, file_key)
#                 arr[index]['frameSubprompts'][f_index]['frameUrl'] = uploaded_image_url
#                 with open('./src/js/constants/promptDataFinal.json', 'w') as file:
#                     json.dump(data, file, indent=4)
#             else:
#                 print("error in generating frame")
#         else:
#             output = replicate.run(
#                 "luma/ray",
#                 input={
#                     "loop": False,
#                     "prompt": arr[index]['sceneSubprompts'][s_index]['text'],
#                     "aspect_ratio": "16:9",
#                     "end_image_url": arr[index]['frameSubprompts'][int((s_index + 1)/2)]['frameUrl'],
#                     "start_image_url": "sadsadsadsad"
#                 }
#             )
#     else:
#         process_generation(arr, index + 1)


def generate_frames(arr, index):
    # if f_index < len(arr[index]['frameSubprompts']):
    print("processing frame - " + str(index))
    # image_prompt = arr[index]['prompt'].replace('video', 'image')
    # image_prompt += " All the people in the image should be South Indian. Settings also in the image should be South Indian"
    # output = replicate.run(
    #     "black-forest-labs/flux-1.1-pro",
    #     input={
    #         "prompt": image_prompt,
    #         "aspect_ratio": "16:9",
    #         "output_format": "png",
    #         "output_quality": 80,
    #         "safety_tolerance": 2,
    #         "prompt_upsampling": True,
    #         # "seed": seed
    #     }
    # )
    # print(output)
    # ts = time.time()
    # save_file_path = f"videos/video{index}/image_{str(int(ts))}_" + \
    #     f"{uuid.uuid4()}.png"
    # response1 = requests.get(output)
    # if response1.status_code == 200:
    #     with open(save_file_path, "wb") as file:
    #         file.write(response1.content)
    #     print(f"Image saved as {save_file_path}")
    #     file_key = f"videos/generation/frames/image_{str(int(ts))}_{uuid.uuid4()}.png"
    #     uploaded_image_url = upload_file_s3(save_file_path, file_key)
    #     arr[index]['frameUrl'] = uploaded_image_url
    #     with open('./src/js/constants/promptDataFinal.json', 'w') as file:
    #         json.dump(arr, file, indent=4)
    # else:
    #     print("error in generating frame")
    # # generate_frames(arr, seed, index, f_index + 1)
    # # else:
    # print("frames done")
    # print(uploaded_image_url)
    # generate_scenes(arr, index, 0)
    video_prompt = arr[index]['prompt']
    video_prompt += " All the people in the video should be South Indian. Settings also in the video should be South Indian"
    # output1 = replicate.run(
    #     "kwaivgi/kling-v1.6-pro",
    #     input={
    #         "prompt": video_prompt,
    #         "duration": 10,
    #         "cfg_scale": 0.5,
    #         "start_image": f"{S3_ENDPOINT}{uploaded_image_url}",
    #         "aspect_ratio": "16:9",
    #         "negative_prompt": ""
    #     }
    # )
    output1 = replicate.run(
        "luma/ray-2-720p",
        input={
            "loop": False,
            "prompt": video_prompt,
            "duration": 9,
            "aspect_ratio": "16:9"
        }
    )
    print(output1)
    ts1 = time.time()
    save_file_path1 = f"videos/video{index}/video_{str(int(ts1))}_" + \
        f"{uuid.uuid4()}.mp4"
    with open(save_file_path1, 'wb') as f:
        f.write(output1.read())

    print(f"Video saved as {save_file_path1}")
    output_path = f"videos/video{index}/video_{str(int(ts1))}_" + \
        f"{uuid.uuid4()}.mp4"
    command = [
        "ffmpeg", "-i", save_file_path1,
        "-filter_complex", "[0:v]setpts=10/9*PTS",
        output_path
    ]

    subprocess.run(command, check=True)
    # video_data = {
    #     "input": {
    #         "prompt": video_prompt,
    #         "duration": 10,
    #         "cfg_scale": 0.5,
    #         "start_image": f"{S3_ENDPOINT}{uploaded_image_url}",
    #         "aspect_ratio": "16:9",
    #         "negative_prompt": ""
    #     }
    # }

    # response = requests.post(url, headers=headers, data=json.dumps(video_data))
    # print(response.json())
    # response_json = response.json()

    # # time.sleep(30)
    # ts = time.time()
    # save_file_path = f"videos/video{index}/video_{str(int(ts))}_" + \
    #     f"{uuid.uuid4()}.mp4"
    # wget.download(
    #     response_json['output'], out=save_file_path)
    # # response1 = requests.get(output)
    # # if response1.status_code == 200:
    # #     with open(save_file_path, "wb") as file:
    # #         file.write(response1.content)
    # #     print(f"Video saved as {save_file_path}")
    file_key1 = f"videos/generation/video_{str(int(ts1))}_{uuid.uuid4()}.mp4"
    uploaded_video_url = upload_file_s3(output_path, file_key1)
    arr[index]['videoUrl'] = uploaded_video_url
    with open('./src/js/constants/promptDataProcessed1.json', 'w') as file:
        json.dump(arr, file, indent=4)
    # else:
    #     print("error in generating frame")
    process_generation(arr, index + 1)


def process_generation(arr, index):
    if index < 20:
        print("processing prompt - " + str(index))
        folder_path = f"videos/video{index}"
        create_folder_and_clear_files(folder_path)
        # gen_seed = random.randint(10000, 99999)
        generate_frames(arr, index)
    else:
        print("all frames generated")


def init_generation():
    with open('./src/js/constants/promptData.json', 'r') as file:
        prompt_arr = json.load(file)
    process_generation(prompt_arr, 10)


init_generation()
