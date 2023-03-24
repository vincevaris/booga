import { addDoc, collection, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import * as yup from 'yup';
import { ChangeEventHandler, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../config/firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage";
import { uuidv4 } from "@firebase/util";

interface ComposeFormData {
    content: string;
}

export const ComposeBox = () => {
    const [ content, setContent ] = useState<string>();
    const [ media, setMedia ] = useState<Blob>();
    const [ user ] = useAuthState(auth);
    const navigate = useNavigate();
    
    const schema = yup.object().shape({
        content: yup.string().required('A post requires content.').max(280, 'A post can only be up to 280 characters.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ComposeFormData>({
        resolver: yupResolver(schema),
    });

    const postsRef = collection(db, 'posts');

    const [disabled, setDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function generateFileRef(): Promise<StorageReference> {
        const id = uuidv4();
        const fileRef = ref(storage, `media/${id}`);
        const exists = await getDownloadURL(fileRef)
            .then(() => Promise.resolve(true))
            .catch(() => Promise.resolve(false));

        return !exists ? fileRef : generateFileRef();
    }

    const onCreatePost = async (data: ComposeFormData) => {
        setDisabled(true);

        let mediaPaths = [];

        if (media) {
            if (!validateFile(media)) {
                setErrorMessage('Invalid file');
                setDisabled(false);
                return;
            }

            const mediaRef = await generateFileRef();
            await uploadBytes(mediaRef, media);
            mediaPaths.push(mediaRef.fullPath);
        }

        return addDoc(postsRef, {
            ...data,
            userId: user?.uid,
            mediaPaths: mediaPaths,
            createdAt: serverTimestamp(),
        }).then(async (result) => {
            removeContent();
            removeMedia();
        }).catch((error) => {
            setErrorMessage(error.message);
        }).finally(() => setTimeout(() => setDisabled(false), 1_000));
    };

    const handleMediaUpload = (event: any) => {
        const file = event.target.files[0];
        if (validateFile(file)) setMedia(file);
    };

    const onContentChange = (event: any) => {
        setContent(event.target.value);
    };

    const removeContent = () => setContent('');
    const removeMedia = () => setMedia(undefined);

    const validateFile = (file: Blob) => {
        if (!file) return true;

        const MAX_FILE_SIZE = 2 * 1024; // 2 MB

        const fileSizeInKB = file.size / 1024;

        // Validate file type
        if (file.type !== 'image/jpeg' && file.type !== 'image/gif' && file.type !== 'image/png')
            return false;

        // Validate file size
        if (fileSizeInKB > MAX_FILE_SIZE) return false;

        return true;
    };

    return (
        <form className='composeBox' onSubmit={handleSubmit(onCreatePost)}>
            <div className='post'>
                <textarea
                    className='composeBox-content'
                    placeholder="What's on your mind?"
                    value={content}
                    onInput={onContentChange}
                    {...register("content")} />
                {media && (
                    <div className='composeBox-media-container'>
                        <img className='composeBox-media' src={URL.createObjectURL(media)} />
                        <button onClick={removeMedia}>X</button>
                    </div>
                )}
            </div>
            <div className='composeBox-controls'>
                <label htmlFor='uploadMedia' className='composeBox-uploadMedia fakeButton'>Upload Media</label>
                <input id='uploadMedia' type='file' onChange={handleMediaUpload} accept='image/jpeg, image/gif, image/png' />
                <input className='composeBox-submit' type="submit" value="Post" disabled={disabled} />
            </div>
            {errorMessage && (
                <p className="error">{errorMessage}</p>
            )}
        </form>
    );
}