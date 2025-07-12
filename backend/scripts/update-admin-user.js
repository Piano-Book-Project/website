const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminUser() {
    try {
        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash('admin1234', 12);

        // 기존 admin 사용자 업데이트
        const updatedUser = await prisma.user.update({
            where: {
                username: 'admin',
            },
            data: {
                nickname: '김츄츄',
                password: hashedPassword,
                role: 'super_admin',
                updatedAt: new Date(),
            },
        });

        console.log('✅ 관리자 사용자가 성공적으로 업데이트되었습니다:');
        console.log('ID:', updatedUser.username);
        console.log('닉네임:', updatedUser.nickname);
        console.log('권한:', updatedUser.role);
        console.log('등록일:', updatedUser.createdAt);
        console.log('수정일:', updatedUser.updatedAt);

    } catch (error) {
        console.error('❌ 오류 발생:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminUser(); 