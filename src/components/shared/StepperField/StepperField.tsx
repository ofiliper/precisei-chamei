'use client'

import { useState } from "react";
import stepperStyle from "./stepper-field";

interface IOptions {
    id: number;
    label: string;
}

interface IStepperField {
    active: number;
    colorActive?: string;
    colorInactive?: string;
    options: IOptions[];
}

export default function StepperField({
    active,
    options,
    colorActive = 'bg-emerald-300',
    colorInactive = 'bg-gray-200' }: IStepperField) {

    return (
        <div>
            <div className="flex mb-10">
                {
                    options &&
                    options.map((item, i) => {
                        return (
                            <div key={i} className="flex w-[30%] items-center gap-3">
                                <span
                                    className={stepperStyle.number(i <= active, { colorActive, colorInactive })}
                                >
                                    {item.id + 1}
                                </span>
                                <span className={stepperStyle.label(i <= active)}>
                                    {item.label}
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}