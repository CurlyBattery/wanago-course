export class CreatePostDto {
  title: string;
  content: string;
  categories: { id: number }[];
}
