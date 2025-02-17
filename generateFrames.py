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
from openai import OpenAI
import re

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


def append_object_to_file(file_path, new_object):
    """
    Appends a new object to a JSON array in a file. Creates the file if it doesn't exist.

    :param file_path: Path to the JSON file.
    :param new_object: The object to append to the JSON array.
    """
    # Check if the file exists
    if os.path.exists(file_path):
        # Open the file and load its contents
        with open(file_path, 'r') as file:
            try:
                data = json.load(file)
                # Ensure the file contains a list
                if not isinstance(data, list):
                    raise ValueError("The file does not contain a JSON array.")
            except json.JSONDecodeError:
                # If the file is empty or contains invalid JSON, start with an empty list
                data = []
    else:
        # If the file does not exist, create it and start with an empty list
        with open(file_path, 'w') as file:
            json.dump([], file)
        data = []

    # Append the new object
    data.append(new_object)

    # Write the updated list back to the file
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)


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

def api_call_llm(prompt):
    try:
        client = OpenAI()
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message
    except Exception as e:
        print(e)
        return False


def get_scenes_prompt(video_prompt_raw):
    return """
Modify the given prompt to create a structured video description with two distinct scenes, ensuring continuity between them. The output should be in **JSON format** with clear descriptions for each scene. 

1. **Scene Breakdown:**  
   - Divide the prompt into **two halves**, ensuring each scene has a well-defined setting and purpose.  
   - The first scene should **introduce** the location, key characters, and interactions.  
   - The second scene should continue smoothly, either shifting the focus within the same environment or transitioning to a new but related setting.  

2. **Clarity & Stability:**  
   - Describe **slow, natural movements** (e.g., gentle gestures, composed posture, steady facial expressions).  
   - Ensure **no blurring, morphing, or unnatural distortions** of human bodies or objects.  
   - Keep the **background visually stable and sharp** throughout.  

3. **Indian Luxury Hotel Theme:**  
   - The setting should be a **luxury Indian hotel**, which could include a **lobby, garden, restaurant, kitchen, spa, or other premium areas**.  
   - The hotel staff should wear **elegant, Indian-inspired uniforms** (e.g., **Nehru jackets, sherwanis, embroidered kurtas, sarees**).  
   - Unless explicitly specified, **all characters should appear Indian** to maintain authenticity.  

4. **JSON Format Output:**  
   - The modified prompt should be formatted as JSON with:  
     - `scene_1`: Describing the **first half** of the video.  
     - `transition`: Briefly explaining how the two scenes connect.  
     - `scene_2`: Describing the **second half** while maintaining continuity.  

Example JSON Structure:  
```json
{
  "scene_1": {
    "description": "Detailed description of the first scene..."
  },
  "transition": "A smooth transition description...",
  "scene_2": {
    "description": "Detailed description of the second scene..."
  }
}


    Here's the prompt:\n
    """ + video_prompt_raw


def generate_frames(arr, index):
    # if f_index < len(arr[index]['frameSubprompts']):
    print("processing frame - " + str(index))

    prompt = get_scenes_prompt(arr[index]['prompt'])
    api_resp = api_call_llm(prompt)
    print(api_resp)

    match = re.search(r'```json\n(.*?)\n```', api_resp.content, re.DOTALL)
    if match:
        json_str = match.group(1)
        json_obj = json.loads(json_str)  # Parse JSON
        print(json_obj)

    image_prompt = json_obj['scene_1']['description'].replace('video', 'image')
    # # # image_prompt += " All the people in the image should be Indian. Settings also in the image should be Indian"
    output = replicate.run(
        # "google/imagen-3",
        # input={
        #     "prompt": image_prompt,
        #     "aspect_ratio": "16:9",
        #     "safety_filter_level": "block_medium_and_above"
        # }
        "black-forest-labs/flux-1.1-pro",
        input={
            "prompt": image_prompt,
            "aspect_ratio": "16:9",
            "output_format": "png",
            "output_quality": 80,
            "safety_tolerance": 2,
            "prompt_upsampling": True,
            # "seed": seed
        }
    )
    print(output)
    ts = time.time()
    first_frame_save_file_path = f"videos/video{index}/image_{str(int(ts))}_" + \
        f"{uuid.uuid4()}.png"
    response1 = requests.get(output)
    if response1.status_code == 200:
        with open(first_frame_save_file_path, "wb") as file:
            file.write(response1.content)
        print(f"Image saved as {first_frame_save_file_path}")
        first_frame_file_key = f"videos/generation/frames/image_{str(int(ts))}_{uuid.uuid4()}.png"
        uploaded_first_frame_url = upload_file_s3(
            first_frame_save_file_path, first_frame_file_key)
        arr[index]['firstFrameUrl'] = uploaded_first_frame_url
    else:
        print("error in generating frame")
    # generate_frames(arr, seed, index, f_index + 1)
    # else:
    print("frames done")
    print(uploaded_first_frame_url)
    # generate_scenes(arr, index, 0)
    video_prompt_1 = json_obj['scene_1']['description']
    # video_prompt += " All the people in the video should be Indian. Settings also in the video should be Indian"
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
            "prompt": video_prompt_1,
            "duration": 5,
            "aspect_ratio": "16:9",
            "start_image_url": f"{S3_ENDPOINT}{uploaded_first_frame_url}"
        }
    )
    print(output1)
    ts1 = time.time()
    first_video_save_file_path = f"videos/video{index}/video_{str(int(ts1))}_" + \
        f"{uuid.uuid4()}.mp4"
    with open(first_video_save_file_path, 'wb') as f:
        f.write(output1.read())

    first_video_file_key = f"videos/generation/video_{str(int(ts1))}_{uuid.uuid4()}.mp4"
    uploaded_first_video_url = upload_file_s3(
        first_video_save_file_path, first_video_file_key)
    arr[index]['firstVideoUrl'] = uploaded_first_video_url

    output_second_frame_path = f"videos/video{index}/image_{str(int(ts1))}_" + \
        f"{uuid.uuid4()}.jpg"
    command = [
        # "ffmpeg", "-i", save_file_path1,
        # "-vf", "select=eq(n\\,N-1)",
        # "-vsync", "vfr", "-q:v", "2",
        "ffmpeg", "-sseof", "-0.1", "-i", first_video_save_file_path,
        "-q:v", "2", "-frames:v", "1", output_second_frame_path
        # output_frame_path
    ]

    subprocess.run(command, check=True)
    ts2 = time.time()
    second_frame_file_key = f"videos/generation/frames/image_{str(int(ts2))}_{uuid.uuid4()}.jpg"
    uploaded_second_frame_url = upload_file_s3(
        output_second_frame_path, second_frame_file_key)
    arr[index]['secondFrameUrl'] = uploaded_second_frame_url

    video_prompt2 = json_obj['scene_2']['description']
    output2 = replicate.run(
        "luma/ray-2-720p",
        input={
            "loop": False,
            "prompt": video_prompt2,
            "duration": 5,
            "aspect_ratio": "16:9",
            "start_image_url": f"{S3_ENDPOINT}{uploaded_second_frame_url}"
        }
    )
    print(output2)
    ts3 = time.time()
    second_video_save_file_path = f"videos/video{index}/video_{str(int(ts3))}_" + \
        f"{uuid.uuid4()}.mp4"
    with open(second_video_save_file_path, 'wb') as f:
        f.write(output2.read())

    # print(f"Video saved as {second_video_save_file_path}")
    # # video_data = {
    # #     "input": {
    # #         "prompt": video_prompt,
    # #         "duration": 10,
    # #         "cfg_scale": 0.5,
    # #         "start_image": f"{S3_ENDPOINT}{uploaded_image_url}",
    # #         "aspect_ratio": "16:9",
    # #         "negative_prompt": ""
    # #     }
    # # }

    # # response = requests.post(url, headers=headers, data=json.dumps(video_data))
    # # print(response.json())
    # # response_json = response.json()

    # # # time.sleep(30)
    # # ts = time.time()
    # # save_file_path = f"videos/video{index}/video_{str(int(ts))}_" + \
    # #     f"{uuid.uuid4()}.mp4"
    # # wget.download(
    # #     response_json['output'], out=save_file_path)
    # # # response1 = requests.get(output)
    # # # if response1.status_code == 200:
    # # #     with open(save_file_path, "wb") as file:
    # # #         file.write(response1.content)
    # # #     print(f"Video saved as {save_file_path}")
    seoncd_video_file_key = f"videos/generation/video_{str(int(ts3))}_{uuid.uuid4()}.mp4"
    uploaded_second_video_url = upload_file_s3(
        second_video_save_file_path, seoncd_video_file_key)
    arr[index]['secondVideoUrl'] = uploaded_second_video_url

    subprocess.run([
        "ffmpeg", "-i", first_video_save_file_path, "-i", second_video_save_file_path,
        "-filter_complex", "[0:v:0][1:v:0]concat=n=2:v=1[outv]",
        "-map", "[outv]", "-preset", "fast", "-crf", "23", "-y", f"output{index}.mp4"
    ], check=True)
    ts4 = time.time()
    full_video_file_key = f"videos/generation/video_{str(int(ts4))}_{uuid.uuid4()}.mp4"
    uploaded_full_video_url = upload_file_s3(
        f"output{index}.mp4", full_video_file_key)
    arr[index]['fullVideoUrl'] = uploaded_full_video_url
    append_object_to_file("promptDataBatch2Processed1.json", arr[index])
    # # else:
    # #     print("error in generating frame")
    # process_generation(arr, index + 1)


def process_generation(arr, index):
    if index < 4:
        print("processing prompt - " + str(index))
        folder_path = f"videos/video{index}"
        create_folder_and_clear_files(folder_path)
        # gen_seed = random.randint(10000, 99999)
        generate_frames(arr, index)
    else:
        print("all frames generated")


def init_generation():
    with open('./src/js/constants/promptDataBatch2.json', 'r') as file:
        prompt_arr = json.load(file)
    process_generation(prompt_arr, 0)


init_generation()


# prompt = get_scenes_prompt("A lively, bustling hotel lobby filled with natural light streaming through large windows. The space is modern and stylish, with elegant furniture, warm lighting, and tasteful décor that reflects an inviting, upscale atmosphere. A diverse group of people from various cultural and professional backgrounds interact harmoniously. Business professionals in sharp suits engage in animated discussions, while casually dressed tourists check maps and share laughter. Hotel staff in crisp uniforms assist guests with warm smiles at the reception desk. A family with children excitedly points at the grand chandelier, while a couple sips coffee in a cozy seating area. In the background, a musician softly plays a grand piano, adding a relaxing ambiance. The scene exudes inclusivity, cooperation, and vibrancy, with people of different ages, ethnicities, and styles seamlessly blending in this dynamic yet welcoming environment.")
# api_resp = api_call_llm(prompt)
# print(api_resp)

# match = re.search(r'```json\n(.*?)\n```', api_resp.content, re.DOTALL)
# if match:
#     json_str = match.group(1)
#     json_obj = json.loads(json_str)  # Parse JSON
#     print(json_obj)
