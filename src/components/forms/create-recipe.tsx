"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { type Ingredient, type Recipe, recipeSchema } from "@/lib/types";

const formSchema = recipeSchema.extend({
  description: z.string().optional(),
  instructions: z.array(z.object({ text: z.string() })).optional(),
  inputUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number().nonnegative().optional(),
        unit: z.string().optional(),
      }),
    )
    .nullish(),
});

export function CreateRecipeForm(props: {
  recipe?: Recipe;
  ingredients?: Ingredient[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.recipe?.name ?? "",
      description: props.recipe?.description ?? "",
      instructions: props.recipe?.instructions?.map((instruction) => ({
        text: instruction,
      })) ?? [{ text: "" }],
      nutrition: props.recipe?.nutrition ?? {
        calories: 0,
        protein: 0,
        fats: 0,
        carbs: 0,
      },
      cookingTimes: props.recipe?.cookingTimes ?? {
        prep: 0,
        cook: 0,
        total: 0,
        additional: 0,
        rest: 0,
        cool: 0,
      },
      imageUrl: props.recipe?.imageUrl ?? "",
      inputUrl: props.recipe?.inputUrl ?? "",
      ingredients: props.ingredients ?? [{ name: "", quantity: 0, unit: "" }],
    },
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const instructions = (data.instructions ?? [])
      .map((i) => i.text.trim())
      .filter(Boolean);

    const ingredients = (data.ingredients ?? [])
      .map((i) => ({
        name: i.name.trim(),
        ...(i.quantity && { quantity: i.quantity }),
        ...(i.unit?.trim() && { unit: i.unit.trim() }),
      }))
      .filter((i) => i.name.length > 0);

    const recipePayload: Recipe = {
      name: data.name.trim(),

      ...(data.description?.trim() && { description: data.description.trim() }),
      ...(instructions.length > 0 && { instructions }),

      ...(data.nutrition?.calories ? { nutrition: data.nutrition } : {}),
      ...(data.cookingTimes?.total ? { cookingTimes: data.cookingTimes } : {}),

      ...(data.inputUrl?.trim() && { inputUrl: data.inputUrl.trim() }),
      ...(data.imageUrl?.trim() && { imageUrl: data.imageUrl.trim() }),
    };

    const payload = {
      recipe: recipePayload,
      ...(ingredients.length > 0 && { ingredients }),
    };

    fetch("/api/recipes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((response) => toast(JSON.stringify(response)));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {instructionFields.map((item, index) => (
          <div key={item.id}>
            <Controller
              control={form.control}
              name={`instructions.${index}.text`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`instructions.${index}`}>
                    Step {index + 1}
                  </FieldLabel>
                  <Textarea {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {index === instructionFields.length - 1 && (
              <Button
                type="button"
                size="icon"
                onClick={() => appendInstruction({ text: "" })}
              >
                <Plus />
              </Button>
            )}

            <Button
              type="button"
              size="icon"
              onClick={() => index > 0 && removeInstruction(index)}
            >
              <Minus />
            </Button>
          </div>
        ))}

        <div className="flex">
          <Controller
            name="nutrition.calories"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nutrition.calories">Calories</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="nutrition.protein"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nutrition.protein">Protein</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="nutrition.fats"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nutrition.fats">Fats</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="nutrition.carbs"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nutrition.carbs">Carbs</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex">
          <Controller
            name="cookingTimes.prep"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cookingTimes.prep">Prep Time</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="cookingTimes.cook"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cookingTimes.cook">Cook Time</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="cookingTimes.total"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cookingTimes.total">Total Time</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {ingredientFields.map((item, index) => (
          <div key={item.id} className="flex">
            <Controller
              name={`ingredients.${index}.name`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`ingredients.${index}.name`}>
                    Ingredient Name
                  </FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name={`ingredients.${index}.quantity`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`ingredients.${index}.quantity`}>
                    Quantity
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name={`ingredients.${index}.unit`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`ingredients.${index}.unit`}>
                    Unit
                  </FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {index === ingredientFields.length - 1 && (
              <Button
                type="button"
                onClick={() =>
                  appendIngredient({ name: "", quantity: 0, unit: "" })
                }
              >
                <Plus />
              </Button>
            )}
            <Button
              type="button"
              onClick={() => index > 0 && removeIngredient(index)}
            >
              <Minus />
            </Button>
          </div>
        ))}

        <Controller
          name="imageUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="inputUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="inputUrl">Input URL</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button>Submit</Button>
    </form>
  );
}
