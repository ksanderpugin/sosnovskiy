import { useMemo, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodEffects } from 'zod';
import ReCAPTCHA from "react-google-recaptcha";
import type { IFormField } from '../../types/IFormField.types';
import './Form.scss';

interface PropTypes {
    schema: z.AnyZodObject,
    meta: Record<string, IFormField>,
    onSubmitHandler: (data: Record<string, unknown>, reset?: () => void) => void,
    buttonTitle: string,
    schemaRefine?: ZodEffects<z.AnyZodObject>,
    addRecapcha?: boolean
}


export const Form = ({schema, meta, onSubmitHandler, buttonTitle, schemaRefine, addRecapcha = false} : PropTypes) => {   

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } =  useForm({
        resolver: zodResolver(schemaRefine || schema)
    });


    const fields = useMemo( () => {
        const inputs = [];
        for (const key in schema.shape) {
            const field = meta[key];
            const input = field.type !== 'textarea' 
                        ? <input 
                            {...register(key)} 
                            id={key}
                            type={field.type} 
                            placeholder={field.placeholder} 
                            required={field.required} />
                        : <textarea 
                            {...register(key)} 
                            id={key}
                            placeholder={field.placeholder} 
                            required={field.required} />

            inputs.push(
                <fieldset key={key}>
                    {
                        ['checkbox', 'radio'].includes(field.type)
                        ? <label htmlFor={key}>
                            {input} {field.label}
                        </label>
                        : <>
                            <label htmlFor={key}>{field.label}</label>
                            {input}
                        </>
                    }
                    {errors[key] && <span>{errors[key].message as string}</span>}
                </fieldset>
            )
        }
        return inputs;
    }, [errors, meta, register, schema.shape]);

    const rcRef = useRef<ReCAPTCHA>(null);

    const onSubmit = async (data: Record<string, unknown>) => {
        if (addRecapcha) {
            const token = await rcRef.current?.executeAsync();
            rcRef.current?.reset();
            return onSubmitHandler({...data, "gRecaptcha": token}, reset); 
        }
        return onSubmitHandler(data, reset); 
    }

    return(
        <form className="base-form" onSubmit={handleSubmit(onSubmit)}>
            
            {fields}

            {addRecapcha && <ReCAPTCHA ref={rcRef} sitekey={import.meta.env.VITE_RECAPCHA_SITE_KEY} size="invisible"/>}

            <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : buttonTitle}
            </button>
        </form>
    )
}