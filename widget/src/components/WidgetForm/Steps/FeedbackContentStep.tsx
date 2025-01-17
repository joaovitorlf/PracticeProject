import { ArrowLeft, Camera } from "phosphor-react";
import { FormEvent, useState } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { api } from "../../../lib/api";
import { CloseButton } from "../../CloseButton";
import { ScreenshotButton } from "./ScreenshotButton";
import { Loading } from "../Loading"
interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    onFeedbackRestartRequested: () => void; 
    onFeedbackSent: () => void;
}

export function FeedbackContentStep({
    feedbackType,
    onFeedbackRestartRequested,
    onFeedbackSent,
    }: FeedbackContentStepProps){
    const [screenshot, setScreenshot] = useState<string | null>(null)
    const [comment, setComment] = useState('')
    const [isSendindFeedback, setIsSendindFeedback] = useState(false);

    const feedbackTypeInfo = feedbackTypes[feedbackType];

    async function handleSubmitFeedback(event: FormEvent) {
        event.preventDefault();

        setIsSendindFeedback(true);

        await api.post('/feedbacks',{
            type: feedbackType,
            comment,
            screenshot,
        })
        setIsSendindFeedback(false);
        onFeedbackSent();   
    }

    return (
        <>
        <header>
            <button 
                type="button" 
                className= "top-5 left-2 absolute text-zinc-400 hover:text-zinc-100 "
                onClick={onFeedbackRestartRequested}
            >
                <ArrowLeft weight="bold" className="w-4 h-4" />            
            </button>

            <span className="text-xl leading-6 flex items-center gap-2">
                    <img src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} className="w-6 h-6" />
                {feedbackTypeInfo.title}
            </span>

            <CloseButton />
        </header>

        <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
            <textarea 
                className="min-w-[304px] w-full min-h-[122px] text-sm placeholder-zinc-400 text-zin-100
                border-zinc-600 bg-transparent rounded-md focus:border-brand-600 focus:ring-brand-600
                focus:ring-1 focus:outline-none resize-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
                placeholder="Algo não está funcionando bem? Quero corrigir. Conte com detalhes oque está acontecendo"
                onChange={event => setComment(event.target.value)}                
            />
            <footer className="flex gap-2 mt-2">
                <ScreenshotButton 
                screenshot={screenshot}
                onScreenshotTook={setScreenshot}
                />        

                <button
                    type="submit"
                    disabled={comment.length === 0 || isSendindFeedback}
                    className="p-2 bg-brand-600 rounded-md border-transparent flex-1 flex justify-center items-center text-sm
                    hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500
                    transition-colors disabled:opacity-50 disabled:hover:bg-brand-600"
                >
                    {isSendindFeedback ? <Loading /> : 'Enviar Feedback'}
                </button>
            </footer>

        </form>
   </>
    )
}