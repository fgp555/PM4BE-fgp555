import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinSizeValidatorPipe } from './pipes/min-size-validator.pipe';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ========================================
  @Post('uploadImage/:productID')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(MinSizeValidatorPipe)
  // swagger input file in /api...
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  // swagger input file in /api.
  async uploadImageController(
    @Param('productID', ParseUUIDPipe) productID: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1000,
            message: 'El archivo es demasiado grande',
          }),
          new FileTypeValidator({
            // fileType: 'image/*',
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const cloudinaryResult = await this.cloudinaryService.uploadImage(file);
    const { url } = cloudinaryResult;

    const updateProduct = await this.fileService.uploadProductImage(productID, url);
    return updateProduct;
  }

  // ========================================
  @Post('test')
  @ApiExcludeEndpoint()
  @UseInterceptors(FileInterceptor('image'))
  async test_uploadImageController(
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return file;
  }
}
